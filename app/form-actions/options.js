'use server';

import db from '@/models/index';

const { Order, Item_Attribute } = db;

export async function selectOption(state, formData) {
  try {
    // const option = formData.get('option');
    const id = formData.get('id');
    const value = formData.get('value');

    const [order, itemAttribute] = await Promise.all([
      Order.findOne({ where: { id } }),
      Item_Attribute.findOne({ where: { value } }),
    ]);

    if (!order || !itemAttribute) {
      return { error: 'Invalid Order or Item' };
    }

    if (order.item_attribute_id === itemAttribute.id) {
      order.item_attribute_id = null;
      await order.save();
      return { status: false };
    } else if (order.item_attribute_id !== itemAttribute.id) {
      order.item_attribute_id = itemAttribute.id;
      await order.save();
    }

    return { status: 200 };
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}
