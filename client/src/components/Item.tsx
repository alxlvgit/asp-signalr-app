import { toast } from "react-toastify";
import { User, useAuth } from "../context/AuthContext";

interface Item {
  id: number;
  userId: number;
  name: string;
  price: number;
  description: string;
  createdAt: string;
  user?: User;
}

const Item = ({ item, creator }: { item: Item; creator: User }) => {
  const { user } = useAuth();
  const placeOrder = async () => {
    try {
      const placeOrder = await fetch(`/api/items/${item.id}/order`, {
        method: "POST",
        body: JSON.stringify({ Username: user?.name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!placeOrder.ok) {
        throw new Error("Order failed");
      }
      toast.success("Order placed successfully! The seller is notified.");
    } catch (error) {
      console.error("Order failed:", error);
      toast.error("Order failed! Please try again.");
    }
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
          src="/placeholder.jpg"
        />
        <div className="flex justify-between flex-col md:flex-row gap-4 w-full p-4">
          <div className="grid gap-0.5 leading-none text-sm font-medium">
            <h3 className="line-clamp-2 text-base mb-1">{item.name}</h3>
            <p className="text-base font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(item.price)}
            </p>
          </div>
          {user?.id !== creator.id && (
            <div className="flex flex-col">
              <p className="text-xs md:text-right  text-gray-500 ">
                Posted by:
              </p>
              <p className="text-xs md:text-right  text-gray-500">
                {creator.name}
              </p>
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 flex flex-col justify-start px-4 pb-6 pt-4">
          <p className="mb-1 text-base font-medium">Item description:</p>
          <p className="text-sm line-clamp-3 text-gray-600">
            {item.description}
          </p>
        </div>
      </div>
      <div className="border-t">
        {user?.id !== creator.id ? (
          <button
            onClick={placeOrder}
            className="w-full p-4 bg-gray-100 hover:bg-gray-300 rounded-b-lg"
          >
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
