import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { APP_NAME } from 'src/app/constants';
import _404Image from 'src/assets/images/404.svg';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>{`Page not found | ${APP_NAME}`}</title>
      </Helmet>

      <div className="flex py-20 flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Not found page</h1>

        <img src={_404Image} alt="404" width={250} height={250} />

        <Link to="/">
          <button className="btn btn-primary">Go back</button>
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
