import React, { useState } from 'react';
import MemberList from '../membership/member';
import OrderList from '../order/order';
import RechargeList from '../recharge/recharge';
import '../../css/dashboard.css';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('members');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="dashboard">
      <h1>管理后台</h1>
      <div className="dashboard-nav">
        <button
          className={activeSection === 'members' ? 'active' : ''}
          onClick={() => handleSectionChange('members')}
        >
          会员管理
        </button>
        <button
          className={activeSection === 'orders' ? 'active' : ''}
          onClick={() => handleSectionChange('orders')}
        >
          订单管理
        </button>
        <button
          className={activeSection === 'recharge' ? 'active' : ''}
          onClick={() => handleSectionChange('recharge')}
        >
          充值配置管理
        </button>
      </div>
      <div className="dashboard-section">
        {activeSection === 'members' && <MemberList />}
        {activeSection === 'orders' && <OrderList />}
        {activeSection === 'recharge' && <RechargeList />}
      </div>
    </div>
  );
};

export default Dashboard;
