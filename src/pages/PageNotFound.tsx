import PageNotFoundImage from "../assets/images/PageNotFound.svg";

function PageNotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img src={PageNotFoundImage} width={500} />
    </div>
  );
}

export default PageNotFound;
