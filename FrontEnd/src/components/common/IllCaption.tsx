interface IllCaptionProps {
  diseaseName: string;
}

const IllCaption = ({ diseaseName }: IllCaptionProps) => {
  return (
    <div className="inline-flex items-center justify-center w-auto max-w-fit px-3 py-1 text-center bg-white rounded-[16px] border-[1px] border-solid border-cardSubcontent font-suite text-18px font-[700] text-cardContent">
      {diseaseName}
    </div>
  );
};

export default IllCaption;
