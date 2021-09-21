import './card.css';

const Card = ({ title, option, children }) => {
  return (
    <div className="card">
      <h2>{title} {option}</h2>
      {children}
    </div>
  );
}

export default Card;