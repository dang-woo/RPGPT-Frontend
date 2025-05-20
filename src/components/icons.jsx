// src/components/icons.jsx
// react-icons 라이브러리가 설치되어 있어야 합니다.
// npm install react-icons 또는 yarn add react-icons

import { FaHome, FaBolt, FaSignOutAlt } from 'react-icons/fa';
import { HiOutlineUserCircle } from 'react-icons/hi';
// import { GiBroadsword, GiMapleLeaf } from 'react-icons/gi'; // 삭제

export const HomeIcon = (props) => <FaHome {...props} />;
// export const SwordIcon = (props) => <GiBroadsword {...props} />; // 로스트아크 아이콘 예시 - 삭제
// export const MapleLeafIcon = (props) => <GiMapleLeaf {...props} />; // 메이플스토리 아이콘 예시 - 삭제
export const BoltIcon = (props) => <FaBolt {...props} />; // 던전앤파이터 아이콘 예시
export const LogOutIcon = (props) => <FaSignOutAlt {...props} />;
export const UserCircleIcon = (props) => <HiOutlineUserCircle {...props} />;

// 참고: 사용하려는 아이콘에 따라 react-icons에서 적절한 아이콘을 찾아 임포트해야 합니다.
// 아이콘 검색: https://react-icons.github.io/react-icons 