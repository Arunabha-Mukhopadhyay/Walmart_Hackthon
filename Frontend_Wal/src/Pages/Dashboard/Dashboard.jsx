import React,{useState,useEffect} from "react";
import Header from "../../components/Header";
import DashboardNav from "../../components/DashboardNav";
import axios from "axios";


const fifoRecommendations = [
  { name: "Canned Tomatoes", shelf: "C-08", action: "Move to front" },
  { name: "Pasta Sauce", shelf: "C-12", action: "Promote sale" },
  { name: "Cereal Boxes", shelf: "D-03", action: "Restock front" },
];



function Dashboard() {
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(()=>{
    axios
      .get('http://localhost:3000/api/v1/product/expiring')
      .then((res) => {
        setExpiredProducts(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching expired products:", err);
      });
  },[])


  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/product/low-stock')
      .then((res) => {
        setLowStockProducts(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching low stock products:", err);
      });
  },[]);

  useEffect(()=>{
    axios
      .get('http://localhost:3000/api/v1/category')
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  },[])

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/product')
      .then((res) => {
        setTotalProducts(res.data.data.length || 0);
      })
      .catch((err) => {
        console.error("Error fetching total products:", err);
      });
  }, []);

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <DashboardNav />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={totalProducts} icon="📦" color="blue" />
        <StatCard label="Expiring Soon" value={expiredProducts.length} icon="⏰" color="red" />
        <StatCard label="Low Stock" value={lowStockProducts.length} icon="📈" color="yellow" />
        <StatCard label="Categories" value={categories.length} icon="📊" color="green" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-4">
            <span>📈</span> FIFO Recommendations
          </h2>
          <ul className="space-y-3">
            {fifoRecommendations.map((item) => (
              <li
                key={item.name}
                className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-3"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    Shelf: {item.shelf}
                  </div>
                </div>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded transition">
                  {item.action}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  </>
  );
}

function StatCard({ label, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
  };
  return (
    <div className="bg-white rounded-xl shadow flex items-center gap-4 p-6">
      <div className={`rounded-full p-3 text-2xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
}

export default Dashboard;
