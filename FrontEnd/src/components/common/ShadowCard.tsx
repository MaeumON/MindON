const Card = ({ children, className = "", style = {} }) => {
  return (
    <section className={`flex flex-col justify-center ${className}`} style={style}>
      <section className="bg-white rounded-[12px] shadow-md p-5 w-[330px]">
        <div className="flex flex-col gap-[10px]">{children}</div>
      </section>
    </section>
  );
};

export default Card;
