import React, { useState, useEffect } from 'react';
import AddConfigModal from '../utils/addConfigModal';
import axios from 'axios';
import '../../css/recharge.css';

interface RechargeConfig {
  id: string;
  name: string;
  price: number;
  create_time: number;
  status: string;
}

const RechargeList: React.FC = () => {
  const [rechargeList, setRechargeList] = useState<RechargeConfig[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const host = "https://agi.ailogy.cn/api";
  const recharge_config_list_url = `${host}/recharge-config/list`;
  const recharge_config_update_status_url = `${host}/recharge-config/update-status`;
  const recharge_config_create_url = `${host}/recharge-config/create`;

  useEffect(() => {
    fetchRechargeList();
  }, []);

  const fetchRechargeList = async () => {
    try {
      const data = {
        "1": "1",
      };
      const response = await axios.post(
        recharge_config_list_url,
        data
      ); // Replace with your API endpoint
      console.log(response.data);
      setRechargeList(response.data.data.recharge_configs);
    } catch (error) {
      console.error('Error fetching recharge list:', error);
    }
  };

    // 点击新增按钮时的处理函数
  const handleAddConfig = () => {
    setShowAddModal(true);
  };

  // 保存新增配置的处理函数
  const handleSaveConfig = async (newConfig: any) => {
    // 这里可以实现保存配置的逻辑
    // 在完成保存后，通过调用 fetchRechargeList() 函数来更新表格数据
    try {
      const data = {
        "name": newConfig.name,
        "valid_periods": newConfig.days * 24 * 60 * 60,
        "price": newConfig.amount * 100,
      };
      const response = await axios.post(
        recharge_config_create_url,
        data
      ); // Replace with your API endpoint
    } catch (error) {
      console.error('Error fetching recharge list:', error);
    }
    fetchRechargeList();
    setShowAddModal(false);
  };

  // 关闭弹窗的处理函数
  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  function formatTimestamp(timestamp: number): string {
    const date = new Date(Number(timestamp) * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function convertToYuan(amountInCents: number): number {
    // 将分转换为元，通过除以 100
    const amountInYuan = amountInCents / 100;
    return amountInYuan;
  }

  const toggleStatus = async (status: string, id: string) => {
    try {
      const data = {
        "1": "1",
        "id": id,
        "status": status,
      };
      const response = await axios.post(
        recharge_config_update_status_url,
        data
      ); // Replace with your API endpoint
      console.log(response.data);
      setRechargeList(prevList =>
        prevList.map(recharge =>
          recharge.id === id ? { ...recharge, status: status } : recharge));
    } catch (error) {
      console.error('Error fetching recharge list:', error);
    }
  }

  return (
    <div className="recharge-list">
      <div className="add-button-container">
        <button className="add-button" onClick={handleAddConfig}>
          新增
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>金额</th>
            <th>创建时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {rechargeList.map((recharge) => (
            <tr key={recharge.id}>
              <td>{recharge.name}</td>
              <td>{convertToYuan(recharge.price)}元</td>
              <td>{formatTimestamp(recharge.create_time)}</td>
              <td>{recharge.status}</td>
              <td>
                {/* 使用按钮代替文字，并调用 toggleStatus 函数 */}
                <button
                  onClick={() => toggleStatus('ACTIVE', recharge.id)}
                >
                  启用
                </button>
                <button
                  onClick={() => toggleStatus('INACTIVE', recharge.id)}
                >
                  停用
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <AddConfigModal onSave={handleSaveConfig} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RechargeList;
