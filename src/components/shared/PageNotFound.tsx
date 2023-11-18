const PageNotFound = () => {
  return (
    <div className="flex items-center justify-start w-full flex-col gap-12">
      <p className="h3-bold mt-12">Sorry, this page isn't available.</p>
      <p className="base-regular">
        The link you followed may be broken, or the page may have been removed.
        Go back to Instagram.
      </p>
    </div>
  );
};

export default PageNotFound;
