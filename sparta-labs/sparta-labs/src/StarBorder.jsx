import './StarBorder.css';

const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = '#e63946',
  speed = '6s',
  thickness = 3,
  children,
  ...rest
}) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder;
