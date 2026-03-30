import React from "react";
import NaviBar from "../../components/NaviBar";

class ShopPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        products: [
            { id: 1, name: 'Apple', description: 'Fresh red apple', price: 1.0, image: 'https://via.placeholder.com/500/ff7f7f/333?text=Apple', category: 'food' },
            { id: 2, name: 'Banana', description: 'Yellow banana', price: 0.5, image: 'https://via.placeholder.com/500/ffff7f/333?text=Banana', category: 'food' },
            { id: 3, name: 'Orange', description: 'Juicy orange', price: 0.8, image: 'https://via.placeholder.com/500/ffbf7f/333?text=Orange', category: 'food' },
            { id: 4, name: 'Grapes', description: 'Bunch of grapes', price: 2.0, image: 'https://via.placeholder.com/500/bf7fff/333?text=Grapes', category: 'food' },
            { id: 5, name: 'Milk', description: 'Fresh whole milk', price: 3.0, image: 'https://via.placeholder.com/500/7fbfff/333?text=Milk', category: 'beverage' },
            { id: 6, name: 'Bread', description: 'Whole grain bread', price: 2.5, image: 'https://via.placeholder.com/500/ffdf7f/333?text=Bread', category: 'food' },
            { id: 7, name: 'Handmade Basket', description: 'Beautiful woven basket', price: 15.0, image: 'https://via.placeholder.com/500/d2b48c/333?text=Basket', category: 'handicrafts' },
            { id: 8, name: 'Ceramic Vase', description: 'Elegant ceramic vase', price: 25.0, image: 'https://via.placeholder.com/500/daa520/333?text=Vase', category: 'handicrafts' },
            { id: 9, name: 'Wooden Sculpture', description: 'Hand-carved wooden sculpture', price: 40.0, image: 'https://via.placeholder.com/500/cd853f/333?text=Sculpture', category: 'handicrafts' },
            { id: 10, name: 'Juice', description: 'Fresh orange juice', price: 4.0, image: 'https://via.placeholder.com/500/ffa500/333?text=Juice', category: 'beverage' },
        ]};
    }
    render() {
        return (
            <div className="min-h-screen flex flex-col">
                <NaviBar />
                <main className="flex-grow container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-4">Shop Management</h1>
                    <p className="text-center text-lg">This is the shop management page. Here you can manage your products, view orders, and more.</p>
                </main>
            </div>
        );
    }
}   
export default ShopPage;