import React, { useEffect, useState, useCallback } from 'react';
import JobCard from '../components/JobCard';
import FilterSection from '../components/FilterSection';
import { Box, Typography, CircularProgress, Button, Grid } from '@mui/material';
import { config } from '../constant';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [endOfJobs, setEndOfJobs] = useState(false);
    const [totalJobs, setTotalJobs] = useState(0);
    const [filters, setFilters] = useState({});

    const fetchJobs = useCallback((pageNumber = 1) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('page', pageNumber);
        Object.entries(filters).forEach(([key, value]) => {
            if (key === 'jobTitles') {
                value?.forEach((titleObj) => {
                    formData.append('jobTitles[]', titleObj.title);
                });
            }
            else if (key === 'uploadedFiles') {
                value?.forEach((file) => {
                    formData.append('uploadedFiles[]', file);
                });
            }
            else if (key === 'locations') {
              value?.forEach((location) => {
                formData.append('locations[]', location);
              });
            }
            else if (key === 'workMode') {
              value?.forEach((workMode) => {
                formData.append('workMode[]', workMode);
              });
            }
            else if (key === 'keywords') {
              value?.forEach((keyword) => {
                formData.append('keywords[]', keyword);
              });
            }
            else if (key === 'minTime' || key === 'maxTime') {
              if (key === 'minTime') {
                formData.append(key, value.startOf('day').unix() * 1000);
                console.log(value.startOf('day').unix() * 1000)
              } else if (key === 'maxTime') {
                formData.append(key, value.endOf('day').unix() * 1000);
                console.log(value.endOf('day').unix() * 1000)
              }
            }
            else {
                formData.append(key, value);
            }
        });

        fetch(config.url.JOBS_URL, {
            method: "POST",
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.jobs.length === 0) {
                setEndOfJobs(true);
            }
            setJobs(prevJobs => [...prevJobs, ...data.jobs]);
            setPage(pageNumber + 1);
            setTotalJobs(data.total);
        })
        .finally(() => setLoading(false));
    }, [filters]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 500 && !loading && !endOfJobs) {
            window.removeEventListener("scroll", handleScroll);
            fetchJobs(page);
        }
    }, [loading, endOfJobs, fetchJobs, page]);

    useEffect(() => {
        fetchJobs(); // Fetch initial jobs
    }, [fetchJobs]);

    useEffect(() => {
        if (!loading) 
            window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll, loading]);

    const handleFilterSubmit = (event, newFilters) => {
        event.preventDefault();
        setJobs([]); // Clear jobs list
        setPage(1); // Reset page number
        setEndOfJobs(false); // Reset end of jobs
        setFilters(newFilters); // Fetch jobs with new filters
    };

    return (
        <Box sx={{ padding: 2}} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Typography variant="h5" component="h1" fontWeight="bold" marginBottom={4}>
                Job Search
            </Typography>

            <Grid container spacing={4} display={"flex"} justifyContent={'center'}>
                <Grid item xs={12} sm={12} md={4} lg={3}>
                    {/* Filters Section */}
                    <FilterSection
                        handleFilterSubmit={handleFilterSubmit}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={6}>
                    {/* Job Listings Section */}
                    <Box>
                        {jobs.map((job, i) => (
                            i % 10 !== 0?
                            <Box key={i}>
                                <JobCard job={job} />
                            </Box>
                            :
                            <Box key={i}>
                                <Typography variant="h6" component="h1" gutterBottom color="primary" fontWeight="bold">
                                    {totalJobs - i} jobs below
                                </Typography>
                                <JobCard job={job} />
                            </Box>
                        ))}
                        {loading && (
                            <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
                        )}
                        {endOfJobs && (
                            <Typography variant="body2" color="textSecondary" align="center">
                                No more jobs to load
                            </Typography>
                        )}
                    </Box>
                    {/* Load More Button */}
                    {!loading && !endOfJobs && (
                        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => fetchJobs(page)}
                            >
                                Load More
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>

        </Box>
    );
};

export default Home;
