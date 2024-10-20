import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Chip } from '@mui/material';


const convertToLakhs = (amount) => {
    if (amount === null) return 'N/A';
    return (amount / 100000).toFixed(2);
};

const JobCard = ({job}) => {

    return (
        <Card sx={{ marginBottom: 2, padding: 2 }} variant='outlined'>
            <CardContent>
                <Typography variant="h6" component="div">
                    {job.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {job.company}
                </Typography>
                <Typography variant="body2">
                    <a href={job.postedUrl} target="_blank" rel="noopener noreferrer">
                        See on LinkedIn
                    </a>
                </Typography>
                {job.staffCountRangeStart && (
                    <Typography variant="body2">
                        Staff Size: {job.staffCountRangeStart}
                        {job.staffCountRangeEnd ? `-${job.staffCountRangeEnd}` : '+'}
                    </Typography>
                )}
                <Typography variant="body2">
                    Location: {job.location}
                </Typography>
                {job.remote && (
                    <Chip label="Remote" sx={{backgroundColor: '#4CAF50', color: 'white'}} />
                )}
                <Typography variant="body2">
                    Listed at: {new Date(job.listedAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                    Experience: {job.experienceMin} - {job.experienceMax} years
                </Typography>
                <Typography variant="body2">
                    Salary: {convertToLakhs(job.salaryMin)} - {convertToLakhs(job.salaryMax)} lakhs
                </Typography>
                <Typography variant="body2">
                    Skills: {job.skills}
                </Typography>
                {job.internship && (
                    <div>
                        <Chip label="Internship" sx={{backgroundColor: '#EA504C', color: 'white'}} />
                        {job.internshipDurationMin && job.internshipDurationMax && (
                            <Typography variant="body2">
                                Internship Duration: {job.internshipDurationMin} - {job.internshipDurationMax} months
                            </Typography>
                        )}
                        {job.stipendMin != null && job.stipendMax != null && (
                            <Typography variant="body2">
                                Stipend: {convertToLakhs(job.stipendMin)} - {convertToLakhs(job.stipendMax)} lakhs
                            </Typography>
                        )}
                    </div>
                )}
                {job.applyUrl && (
                    <Button
                        variant="contained"
                        color="primary"
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ marginTop: 1, marginRight: 2}}
                    >
                        Apply
                    </Button>
                )}
                <Button
                    variant="outlined"
                    color="secondary"
                    component={Link}
                    target="_blank"
                    to={`/job/${job.id}`}
                    sx={{ marginTop: 1 }}
                >
                    Show more
                </Button>
            </CardContent>
        </Card>
    );
}

export default JobCard