import { sequelize } from '@/models/index';
import InviteLinkGenerator from '../Components/generate-invite';
import PayButton from '../Components/pay-button';
import MyProduct from '../Components/my-product';

export default async function MyCart({ searchParams }) {
  const { id } = searchParams;

  try {
    const cart = await sequelize.query(
      `
    SELECT 
        u.id AS "userId", 
        u.name AS "userName", 
        o.id AS "orderId", 
        o."totalAmount", 
        i.id AS "itemId", 
        i.name AS "itemName", 
        i.price AS "itemPrice",
        i.image AS "itemSrc",
        i.description AS "itemDescription",
        i.status AS "itemStatus",
        i.quantity AS "itemQuantity",
        i.discount AS "itemDiscount",
        i.sku AS "itemSku",
        c.id AS "categoryId",
        c.name AS "categoryName"
      FROM "Users" u
      LEFT JOIN "Orders" o ON u.id = o."userId"
      LEFT JOIN "items" i ON o."itemId" = i.id
      LEFT JOIN "Categories" c ON i."categoryId" = c.id
      WHERE u.sub = :sub
      `,
      {
        replacements: { sub: id },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    if (cart.length === 0) {
      return <p>No chosen item</p>;
    }

    return (
      <div className="w-full p-4">
        {cart.map(
          ({
            itemName,
            itemDescription,
            itemSrc,
            categoryName,
            itemPrice,
            totalAmount,
            itemStatus,
            itemQuantity,
            itemDiscount,
            orderId,
            userId,
          }) => (
            <MyProduct
              key={itemName}
              originalPrice={itemPrice}
              itemName={itemName}
              itemDescription={itemDescription}
              itemSrc={itemSrc}
              itemCategory={categoryName}
              itemPrice={totalAmount}
              itemStatus={itemStatus}
              itemQuantity={itemQuantity}
              itemDiscount={itemDiscount}
            >
              <PayButton
                className="bg-orange-600 text-white rounded-sm shadow-md hover:bg-blue-700 text-base font-bold w-20"
                orderId={orderId}
              >
                Buy {itemName}
              </PayButton>
              <InviteLinkGenerator
                category={categoryName}
                product={itemName}
                inviterId={userId}
                className="bg-blue-500 text-white rounded-sm shadow-md hover:bg-green-600 text-base font-bold w-20"
              >
                Invite
              </InviteLinkGenerator>
            </MyProduct>
          ),
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
    return <p>Error fetching user details</p>;
  }
}
