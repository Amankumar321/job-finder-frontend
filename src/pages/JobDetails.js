import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../constant';
import { Typography, Paper, Divider, Link } from '@mui/material';
import JobCard from '../components/JobCard';


const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        fetch(`${config.url.JOB_DETAIL_URL}/${id}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch');
                }
            })
            .then(json => {
                setJob(json);
            })
            .catch(error => {
                console.error('Error fetching job details:', error);
            });
    }, [id]);

    return (
        <Paper elevation={3} sx={{maxWidth: 800, marginTop: 2, marginBottom: 2, padding: 2, marginLeft: "auto", marginRight: "auto"}}>
            {job && (
                <>
                    <JobCard job={job} showMoreButton={false}/>
                    <Divider />
                    <Typography variant="subtitle2" marginTop={2}>
                        <Typography variant="subtitle2" dangerouslySetInnerHTML={{__html: job.descriptionHtml}}></Typography>
                    </Typography>
                    {job.companyDescription && (
                        <Typography variant="subtitle2" mt={4}>
                            <b>Company Description:</b>
                            <p style={{whiteSpace: "pre-wrap"}}>{job.companyDescription}</p>
                        </Typography>
                    )}
                </>
            )}
        </Paper>
    );
};

export default JobDetails;
