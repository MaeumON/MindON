interface IllCaptionProps {
  text?: string;
}

const IllCaption = ({ text = "치매" }: IllCaptionProps) => {
  return (
    <div className="h-[35px] w-[60px] text-center flex items-center justify-center bg-white rounded-[16px] border-[1px] border-solid border-cardSubcontent font-suite text-[18px] font-[700] text-cardContent">
      {text}
    </div>
  );
};

export default IllCaption;
