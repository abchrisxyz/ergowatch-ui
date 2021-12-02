import './selector.css';

const SelectorOption = ({ label, active, className = '', onClick }) => {
  return (
    <li
      className={active ? className + ' active' : className}
      onClick={onClick}
    >
      {label}
    </li>
  );
}

const Selector = ({ children }) => {
  return (
    <ul className="selector">
      {children}
    </ul>
  );
}

export { Selector, SelectorOption };