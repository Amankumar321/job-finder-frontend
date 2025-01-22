import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Chip, Box, Rating } from '@mui/material';
import RatingColor from './RatingColor';
import PeopleIcon from '@mui/icons-material/People';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentsIcon from '@mui/icons-material/Payments';

const convertToLakhs = (amount) => {
    if (amount === null) return 'N/A';
    return (Math.round(amount / 10000) / 10).toFixed(1);
};

const convertToThousands = (amount) => {
  if (amount === null) return 'N/A';
  return (Math.round(amount / 100) / 10).toFixed(1);
};

const unixToDateString = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`
}

const JobCard = ({job, showMoreButton=true}) => {
    const ratings = {
      'skillDevelopmentRating': 'Skill Development',
      'workLifeRating': 'Work Life Balance',
      'compensationBenefitsRating': 'Salary & Benefits',
      'jobSecurityRating': 'Job Security',
      'careerGrowthRating': 'Career Growth',
      'workSatisfactionRating': 'Work Satisfaction',
      'companyCultureRating': 'Work Culture'
    }

    return (
        <Card sx={{ marginBottom: 2, padding: 2 }} variant='outlined'>
            <CardContent>
                <Typography variant="h6" component="div">
                    {job.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant="subtitle1" color="textSecondary" noWrap>
                      {job.company}
                  </Typography>
                  <Rating readOnly value={job.overallCompanyRating} precision={0.01} size="small"/>
                  <Chip sx={{px: 0.5}} variant="outlined" size="small" icon={<PeopleIcon fontSize="small" />} label={`${job.staffCountRangeStart}${job.staffCountRangeEnd ? " - " + job.staffCountRangeEnd : '+'}`} />
                  <Typography variant="body2" noWrap>
                    <a href={`https://www.ambitionbox.com/overview/${job.urlName}-overview`} target="_blank" rel="noopener noreferrer">
                        See on Ambitionbox
                    </a>
                  </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" my={1} rowGap={1} columnGap={2}>
                  {
                    Object.keys(ratings).map(key => {
                      return (
                        <Box display="flex" alignItems="center" justifyContent="space-between" width={150}>
                          <Typography noWrap variant="caption">{ratings[key]}</Typography>
                          <RatingColor rating={job[key].toFixed(2)} />
                        </Box>
                      )
                    })
                  }
                </Box>
                    
                <Typography variant="body2">
                    <a href={job.postedUrl} target="_blank" rel="noopener noreferrer">
                        See on LinkedIn
                    </a>
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1} my={1}>
                    {job.workMode === "Remote" && (
                        <Chip label="Remote" sx={{backgroundColor: '#4CAF50', color: 'white', px: 0.5}} />
                    )}
                    {job.workMode === "Hybrid" && (
                        <Chip label="Hybrid" sx={{backgroundColor: '#9933ff', color: 'white', px: 0.5}} />
                    )}
                    {job.internship && (
                        <Chip label="Internship" sx={{backgroundColor: '#EA504C', color: 'white', px: 0.5}} />
                    )}
                    {job.internshipDurationMin && (
                        <Chip sx={{px: 0.5}} icon={<AccessTimeIcon fontSize="small" />} label={`${job.internshipDurationMin} - ${job.internshipDurationMax} months`} />
                    )}
                    {job.stipendMin && (
                        <Chip sx={{px: 0.5}} icon={<PaymentsIcon fontSize="small" />} label={`${convertToThousands(job.stipendMin)}k - ${convertToThousands(job.stipendMax)}k / month`} />
                    )}
                    <Chip sx={{px: 0.5}} icon={<PlaceIcon fontSize="small" />} label={job.location} />
                    <Chip sx={{px: 0.5}} icon={<CalendarMonthIcon fontSize="small" />} label={unixToDateString(job.listedAt)} />
                    <Chip sx={{px: 0.5}} icon={<WorkIcon fontSize="small" />} label={`${job.experienceMin} - ${job.experienceMax} years`} />
                    <Chip sx={{px: 0.5}} icon={<CurrencyRupeeIcon fontSize="small" />} label={`${convertToLakhs(job.salaryMin)} - ${convertToLakhs(job.salaryMax)} lakhs / year`} />
                </Box>
                {job.skills && (
                  <Typography variant="body2">
                      Skills: {job.skills}
                  </Typography>
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
                {showMoreButton &&
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
                }
            </CardContent>
        </Card>
    );
}

export default JobCard