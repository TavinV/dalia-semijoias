import Header from './components/layout/Header'
import './index.css'
import Banner from './components/layout/Banner.jsx';
import { useCart } from "./hooks/useCart.jsx";


function App() {
  const {addItem} = useCart()
  return (
    <>
      <Header />

      <Banner></Banner>
      <button onClick={() => {

        const mockItem = {
          id: "DAL-ANELOURO",
          name: "Anel 9 linhas",
          material: "ouro 18k",
          price: 28,
          image: "https://plus.unsplash.com/premium_photo-1709033404514-c3953af680b4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }

        addItem(mockItem)

      }}> adicionar itens mock no carrinho.</button>
    </>
  )
}

export default App
