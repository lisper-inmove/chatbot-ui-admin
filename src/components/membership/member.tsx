import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/member.css';

interface Member {
  id: number;
  name: string;
  phone: string;
  email: string;
  expirationDate: string;
  membershipLevel: string;
}

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(10);
  const [pageNumberLimit] = useState(10);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageNumberLimit);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  const [inputPage, setInputPage] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // const response = await axios.get('API_ENDPOINT/members');
      // setMembers(response.data);

      // TODO: for test
      const fakeMembers: Member[] = [];
      for (let i = 1; i <= 3000; i++) {
        const member: Member = {
          id: i,
          name: `Member ${i}`,
          phone: `123-456-${i.toString().padStart(2, '0')}`,
          email: `member${i}@example.com`,
          expirationDate: '2023-12-31',
          membershipLevel: 'Gold',
        };
        fakeMembers.push(member);
      }

      setMembers(fakeMembers);
    } catch (error) {
      console.log(error);
    }
  };

  // 获取当前页的会员列表
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  // 分页切换
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 下一页
  const nextPage = () => {
    if (currentPage < Math.ceil(members.length / membersPerPage)) {
      setCurrentPage(currentPage + 1);

      if (currentPage + 1 > maxPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      }
    }
  };

  // 上一页
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);

      if ((currentPage - 1) % pageNumberLimit === 0) {
        setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      }
    }
  };

  // 跳转到指定页
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
    console.log(left_half, right_half);
    if (left_half <= 1) {
      return [0, right_half - left_half];
    }
    if (right_half >= maxPageNumber) {
      return [maxPageNumber - pageNumberLimit, maxPageNumber];
    }
    return [left_half, right_half];
  }

  return (
    <div className="member-list">
      <h1>Member List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Expiration Date</th>
            <th>Membership Level</th>
          </tr>
        </thead>
        <tbody>
          {currentMembers.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.phone}</td>
              <td>{member.email}</td>
              <td>{member.expirationDate}</td>
              <td>{member.membershipLevel}</td>
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

