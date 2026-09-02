import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <div className="breadcrumb__item">
        <Link to="/" className="breadcrumb__link">
          <span>🏠</span>
          <span>Home</span>
        </Link>
      </div>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div className="breadcrumb__item" key={index}>
            <span className="breadcrumb__separator">/</span>
            {isLast || !item.link ? (
              <span className="breadcrumb__current">{item.label}</span>
            ) : (
              <Link to={item.link} className="breadcrumb__link">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
