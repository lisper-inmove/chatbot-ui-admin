import React, { useState, useEffect } from 'react';
import MyDatePicker from '../utils/myDatePicker';
import axios from 'axios';
import '../../css/member.css';

interface Member {
  id: string;
  username: string;
  phone: string;
  email: string;
  create_time: number;
  vip_expire_at: number;
  is_disabled: boolean;
  is_vip: boolean;
}

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(10);
  const [pageNumberLimit] = useState(10);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageNumberLimit);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  const [inputPage, setInputPage] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const host = "https://admin.ailogy.cn/api"
  const memberListUrl = `${host}/user/list`;
  const memberListByUsernameUrl = `${host}/user/list-by-username`;
  const disableVipUrl = `${host}/user/disable-or-enable-vip`;
  const changeVipExpireTimeUrl = `${host}/user/set-vip-expire-time`;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = {
        "1": "1",
      };
      const response = await axios.post(
        memberListUrl,
        data,
      );
      setMembers(response.data.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDatePicker = (member: Member) => {
    setEditingMember(member);
    setShowDatePicker(!showDatePicker);
  };

  const updateExpirationDate = (newDate: string) => {
    if (editingMember) {
      // TODO: 发送更新到期时间的请求
      // 更新成员列表中对应成员的到期时间
      const updatedMembers = members.map((member) => {
        if (member.id === editingMember.id) {
          return {
            ...member,
            vip_expire_at: new Date(newDate).getTime() / 1000
          };
        }
        return member;
      });
      setMembers(updatedMembers);
      toggleDatePicker(editingMember);
    }
  };

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(members.length / membersPerPage)) {
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
    if (currentPage >= 1 && currentPage <= Math.ceil(members.length / membersPerPage)) {
      setCurrentPage(currentPage);
      const [l, r] = getNumbersWhenGo(currentPage);
      setMaxPageNumberLimit(r);
      setMinPageNumberLimit(l);
      setInputPage('');
    }
  };

  function getNumbersWhenGo(currentPage: number): [number, number] {
    const maxPageNumber = Math.ceil(members.length / membersPerPage);
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

  function formatTimestamp(timestamp: number, is_vip: boolean): string {
    if (!is_vip) {
      return "未订阅";
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

  const disableVip = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const userId = event.currentTarget.getAttribute('data-userid');
    const disable = event.currentTarget.getAttribute('data-disable');
    if (userId) {
      try {
        const data = {
          "user_id": userId,
          "disable": disable === "true",
        };
        const response = await axios.post(
          disableVipUrl,
          data,
        );
        const updatedMembers = members.map((member) => {
          if (member.id === userId) {
            return {
              ...member,
              is_disabled: disable === "true",
            };
          }
          return member;
        });
        setMembers(updatedMembers);
        alert(response.data.msg);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onExpireDateChange = async (date: Date, id: string) => {
    console.log(date);
    try {
      const data = {
        "user_id": id,
        "vip_expire_at": date.getTime() / 1000,
      };
      const response = await axios.post(
        changeVipExpireTimeUrl,
        data,
      );
      alert(response.data.msg);
    } catch (error) {
      console.log(error);
    }
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const [lastCreateTime, setLastCreateTime] = useState(0);

  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter') {
      try {
        const data = {
          "username": searchTerm,
          "lastCreateTime": lastCreateTime === 0 ? '0' : lastCreateTime,
        };
        const response = await axios.post(
          memberListByUsernameUrl,
          data,
        );

        setMembers(response.data.data.users);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSearchTerm(e.target.value);
    }
  };

  return (
    <div className="member-list">
      <input
        type="text"
        placeholder="搜索用户"
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
            <th>账号</th>
            <th>注册时间</th>
            <th>到期时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentMembers.map((member) => (
            <tr key={member.id}>
              <td>{member.username}</td>
              <td>{formatTimestamp(member.create_time, true)}</td>
              <td>
                {editingMember && editingMember.id === member.id && showDatePicker ? (
                  <MyDatePicker
                    selected={Number(member.vip_expire_at) === 0 ? new Date() : new Date(member.vip_expire_at * 1000)}
                    onChange={onExpireDateChange}
                    userId={member.id}
                  />
                ) : (
                  <span onClick={() => toggleDatePicker(member)}>
                    {formatTimestamp(member.vip_expire_at, member.is_vip)}
                  </span>
                )}
              </td>
              <td>
                <button
                  onClick={disableVip}
                  data-userid={member.id}
                  data-disable={true}
                  className={!member.is_disabled ? "un-highlight" : ""}
                >
                  禁用
                </button>
                <button
                  onClick={disableVip}
                  data-userid={member.id}
                  data-disable={false}
                  className={member.is_disabled ? "un-highlight" : ""}
                >
                  启用
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
        {Array.from({ length: Math.ceil(members.length / membersPerPage) }).map((_, index) => {
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
        <button onClick={nextPage} disabled={currentPage === Math.ceil(members.length / membersPerPage)}>Next</button>
        <div className="input-container">
          <input type="number" min="1" max={Math.ceil(members.length / membersPerPage)} value={inputPage} onChange={(e) => setInputPage(e.target.value)} />
          <button onClick={goToPage}>Go</button>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
