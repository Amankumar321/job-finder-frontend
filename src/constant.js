const prod = {
	url: {
		JOBS_URL: 'https://job-finder-bdzz.onrender.com/jobs',
		JOB_DETAIL_URL: 'https://job-finder-bdzz.onrender.com/job',
		LOCATION_SEARCH_URL: 'https://job-finder-bdzz.onrender.com/location'
	},
};

const dev = {
	url: {
		JOBS_URL: 'http://localhost:5000/jobs',
		JOB_DETAIL_URL: 'http://localhost:5000/job',
		LOCATION_SEARCH_URL: 'http://localhost:5000/location'
	},
};

export const config = process.env.NODE_ENV === 'development' ? prod : prod;