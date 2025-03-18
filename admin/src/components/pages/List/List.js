import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/food/list`);
      
      if (response.data.success) {
        setList(response.data.data);
        setFilteredList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId, foodName) => {
    if (window.confirm(`Are you sure you want to delete "${foodName}"?`)) {
      try {
        const response = await axios.delete(`${url}/api/food/remove/${foodId}`);

        if (response.data.success) {
          toast.success("Food item deleted successfully");
          fetchList(); // Refresh list after deletion
        } else {
          toast.error(response.data.message || "Failed to delete food item");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting food item");
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredList(list);
    } else {
      const filtered = list.filter(
        item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredList(filtered);
    }
  }, [searchTerm, list]);

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Food Items</h2>
        <div className="list-search">
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="empty-list">
          <p>Loading food items...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="empty-list">
          <p>No food items found</p>
        </div>
      ) : (
        <>
          <div className="list-table">
            <div className="list-table-header">
              <span>Image</span>
              <span>Name</span>
              <span className="category-column">Category</span>
              <span className="price-column">Price</span>
              <span>Action</span>
            </div>
            
            {filteredList.map((item) => (
              <div className="list-table-row" key={item._id}>
                <div>
                  <img src={item.image.url} alt={item.name} />
                </div>
                <p>{item.name}</p>
                <p className="category-column">
                  <span className="category-badge">{item.category}</span>
                </p>
                <p className="price-column price">${item.price.toFixed(2)}</p>
                <button 
                  className="delete-btn" 
                  onClick={() => removeFood(item._id, item.name)}
                  title="Delete item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default List;
