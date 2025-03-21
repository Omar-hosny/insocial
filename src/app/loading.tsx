const loading = () => {
  return (
    <div className="w-full flex flex-col gap-2 items-center justify-center h-[80svh]">
      <div className="w-12 h-12 border-[5px] border-orange-600 border-t-transparent rounded-full inline-block animate-spin"></div>
      <h1 className="text-2xl">loading...</h1>
    </div>
  );
};

export default loading;
