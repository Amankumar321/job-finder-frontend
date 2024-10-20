import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../constant';
import { Typography, Paper, Divider, Link } from '@mui/material';


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

    const convertToLakhs = (amount) => {
        if (amount === null) return 'N/A';
        return (amount / 100000).toFixed(2);
    };

    return (
        <Paper elevation={3} sx={{maxWidth: 800, marginTop: 2, marginBottom: 2, padding: 2, marginLeft: "auto", marginRight: "auto"}}>
            {job && (
                <>
                    <Typography variant="h5" gutterBottom>{job.title}</Typography>
                    <Typography variant="body1" gutterBottom>
                        Company: {job.company}
                    </Typography>
                    {job.staffCountRangeStart && (
                        <Typography variant="body1">
                            Staff Size: {job.staffCountRangeStart}
                            {job.staffCountRangeEnd ? `-${job.staffCountRangeEnd}` : '+'}
                        </Typography>
                    )}
                    <Typography variant="body1">
                        Location: {job.location}
                    </Typography>
                    <Typography variant="body1">
                        Listed At: {new Date(job.listedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">
                        Remote: {job.remote ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body1">
                        <Link href={job.postedUrl} target="_blank" rel="noopener noreferrer">
                            See on LinkedIn
                        </Link>
                    </Typography>
                    <Typography variant="body1">
                        Internship: {job.internship ? 'Yes' : 'No'}
                    </Typography>
                    {job.internship && (
                        <>
                            <Typography variant="body1">
                                Internship Duration: {job.internshipDurationMin} - {job.internshipDurationMax} months
                            </Typography>
                            <Typography variant="body1">
                                Stipend: {convertToLakhs(job.stipendMin)} - {convertToLakhs(job.stipendMax)} lakhs
                            </Typography>
                        </>
                    )}
                    <Typography variant="body1">
                        Experience: {job.experienceMin} - {job.experienceMax} years
                    </Typography>
                    <Typography variant="body1">
                        Salary: {convertToLakhs(job.salaryMin)} - {convertToLakhs(job.salaryMax)} lakhs
                    </Typography>
                    <Typography variant="body1">
                        Skills: {job.skills}
                    </Typography>
                    {job.applyUrl && (
                        <Typography variant="body1">
                            <Link href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                                Apply
                            </Link>
                        </Typography>
                    )}
                    <Divider />
                    <Typography variant="body1" marginTop={2}>
                        <b>Description:</b>
                        <p style={{whiteSpace: "pre-wrap"}}>{job.description}</p>
                    </Typography>
                    {job.companyDescription && (
                        <Typography variant="body1">
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
