interface Item {
  id: number;
  userId: number;
  name: string;
  price: number;
  description: string;
  createdAt: string;
}

const Item = ({ item, userId }: { item: Item; userId: number }) => {
  const placeOrder = async () => {
    alert("Order Placed. All users notified.");
    console.log("Order Placed");
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full col-span-1 rounded-lg border shadow-lg">
      <div className="flex-1">
        <img
          alt="Image"
          className="aspect-video object-cover w-full rounded-t-lg brightness-75"
          src="https://picsum.photos/800/400/?random"
        />
        <div className="grid gap-0.5 leading-none text-sm font-medium p-4">
          <h3 className="line-clamp-2 mb-1">{item.name}</h3>
          <p className="text-base font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(item.price)}
          </p>
        </div>
      </div>
      <div className="border-t">
        {userId !== item.userId ? (
          <button onClick={placeOrder} className="w-full p-4 hover:bg-gray-100">
            Place Order
          </button>
        ) : (
          <div className="flex">
            <button
              disabled
              className="w-full p-4 text-sm text-gray-500 bg-gray-100"
            >
              My Item
            </button>
            <button
              onClick={handleDelete}
              className="w-full p-4 hover:bg-gray-600 hover:text-white"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
