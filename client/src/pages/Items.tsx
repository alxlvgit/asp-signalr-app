import { useEffect, useState } from "react";
import useSignalR from "../hooks/useSignalR";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";
import Item from "../components/Item";
import AddItemDialog from "../components/AddItemDialog";

export default function Items() {
  const { connection } = useSignalR("/r/itemshub");
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const response = await fetch("/api/items");
      const data = await response.json();
      setLoading(false);
      setItems(data);
    }
    fetchItems();
  }, []);

  useEffect(() => {
    if (!connection) {
      return;
    }

    connection.on("ItemCreated", (item) => {
      console.log("ItemCreated", item);
      setItems((prevItems) => [item, ...prevItems]);
    });

    connection.on("ItemDeleted", (itemId) => {
      console.log("ItemDeleted", itemId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    });

    return () => {
      connection.off("ItemCreated");
      connection.off("ItemDeleted");
    };
  }, [connection]);

  return (
    <div className="flex min-h-full w-full flex-col justify-center px-6 py-12 lg:px-16">
      <div className="flex items-center justify-between">
        <AddItemDialog />
        <LogoutButton />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6 w-full">
        {loading ? (
          <div className="animate-spin col-span-full rounded-full h-16 w-16 mx-auto border-t-2 border-b-2 border-gray-900"></div>
        ) : (
          items.map((item) => (
            <Item key={item.id} item={item} userId={user!.id!} />
          ))
        )}
      </div>
    </div>
  );
}
