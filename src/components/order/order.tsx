import React, { useState, useEffect } from 'react';
import MyDatePicker from '../utils/myDatePicker';
import axios from 'axios';
import '../../css/order.css';

interface Order {
  id: string;
  status: string;
  pay_method: string;
  type: string;
  third_party_id: string;
  create_time: number;
  success_time: number;
  pay_fee: number;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [pageNumberLimit] = useState(10);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageNumberLimit);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  const [inputPage, setInputPage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lastCreateTime, setLastCreateTime] = useState(0);
  const host = "https://admin.ailogy.cn/api"
  const orderListUrl = `${host}/transaction/list`;
  const orderListByStatusUrl = `${host}/transaction/list-by-status`;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = {
        "1": "1",
        "lastCreateTime": lastCreateTime === 0 ? '0' : lastCreateTime,
      };
      const response = await axios.post(
        orderListUrl,
        data,
      );
      setOrders(response.data.data.transactions);
      if (orders.length > 0) {
        setLastCreateTime(orders[orders.length - 1].create_time);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);

      if (currentPage + 1 > maxPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);

      if ((currentPage - 1) % pageNumberLimit === 0) {
        setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      }
    }
  };

  const goToPage = () => {
    const currentPage = parseInt(inputPage);
    if (currentPage >= 1 && currentPage <= Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage);
      const [l, r] = getNumbersWhenGo(currentPage);
      setMaxPageNumberLimit(r);
      setMinPageNumberLimit(l);
      setInputPage('');
    }
  };

  function getNumbersWhenGo(currentPage: number): [number, number] {
    const maxPageNumber = Math.ceil(orders.length / ordersPerPage);
    if (maxPageNumber <= pageNumberLimit) {
      return [0, maxPageNumber];
    }
    const left_half = currentPage - pageNumberLimit / 2;
    const right_half = currentPage + pageNumberLimit / 2;
    if (left_half <= 1) {
      return [0, right_half - left_half];
    }
    if (right_half >= maxPageNumber) {
      return [maxPageNumber - pageNumberLimit, maxPageNumber];
    }
    return [left_half, right_half];
  }

  function formatTimestamp(timestamp: number): string {
    if (Number(timestamp) === 0) {
      return "未支付";
    }
    const date = new Date(Number(timestamp) * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleKeyDown = async (e: any) => {
    console.log(e.target.value);
    if (e.key === 'Enter') {
      try {
        const data = {
          "1": "1",
          "status": searchTerm,
          "lastCreateTime": lastCreateTime === 0 ? '0' : lastCreateTime,
        };
        const response = await axios.post(
          orderListByStatusUrl,
          data,
        );

        // 根据搜索词过滤订单数据
        const filteredOrders = response.data.data.transactions.filter((order: Order) => {
          // 这里假设你要根据订单状态进行搜索
          setLastCreateTime(order.create_time);
          return order.status.includes(e.target.value);
        });
        setOrders(filteredOrders);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSearchTerm(e.target.value);
    }
  };


  return (
    <div className="order-list">
      <input
        type="text"
        placeholder="搜索订单状态"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        className="search-input"
      />
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>订单ID</th>
            <th>第三方订单ID</th>
            <th>订单状态</th>
            <th>创建时间</th>
            <th>支付完成时间</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.third_party_id}</td>
              <td>{order.status}</td>
              <td>{formatTimestamp(order.create_time)}</td>
              <td>{formatTimestamp(order.success_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }).map((_, index) => {
          if (index < maxPageNumberLimit && index >= minPageNumberLimit) {
            return (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            );
          }
          return null;
        })}
        <button onClick={nextPage} disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}>Next</button>
        <div className="input-container">
          <input type="number" min="1" max={Math.ceil(orders.length / ordersPerPage)} value={inputPage} onChange={(e) => setInputPage(e.target.value)} />
          <button onClick={goToPage}>Go</button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
