import React, { useState } from 'react';

interface AddConfigModalProps {
  onSave: (newConfig: any) => void;
  onClose: () => void;
}

const AddConfigModal: React.FC<AddConfigModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [daysError, setDaysError] = useState<string | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setNameError(null); // 清除错误
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
    setAmountError(null); // 清除错误
  };

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(event.target.value);
    setDaysError(null); // 清除错误
  };

  const handleSaveConfig = () => {
    const newConfig = {
      name,
      amount,
      days,
    };

    if (!newConfig.name) {
      setNameError('名称不能为空');
      return;
    }

    if (!newConfig.amount) {
      setAmountError('金额不能为空');
      return;
    }

    if (!newConfig.days) {
      setDaysError('有效天数不能为空');
      return;
    }

    onSave(newConfig);
  };

  return (
    <div className="add-config">
      <h2>新增充值</h2>
      <input
        type="text"
        placeholder="名称"
        value={name}
        onChange={handleNameChange}
        className={`input-field ${nameError ? 'error' : ''}`}
      />
      {nameError && <div className="error-message">{nameError}</div>}
      <input
        type="text"
        placeholder="金额"
        value={amount}
        onChange={handleAmountChange}
        className={`input-field ${amountError ? 'error' : ''}`}
      />
      {amountError && <div className="error-message">{amountError}</div>}
      <input
        type="text"
        placeholder="有效期(单位: 天)"
        value={days}
        onChange={handleDaysChange}
        className={`input-field ${daysError ? 'error' : ''}`}
      />
      {daysError && <div className="error-message">{daysError}</div>}
      <div className="button-container">
        <button className="cancel-button" onClick={onClose}>
          取消
        </button>
        <button className="save-button" onClick={handleSaveConfig}>
          保存
        </button>
      </div>
    </div>
  );
};

export default AddConfigModal;

