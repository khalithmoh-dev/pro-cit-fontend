import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/* eslint-disable */

const useQuery = (): URLSearchParams | undefined => {
	const [query, setQuery] = useState<URLSearchParams>();
	const location = useLocation();

	useEffect((): void => {
		setQuery(new URLSearchParams(location.search));
	}, [location.search]);

	return query;
};

export default useQuery;
