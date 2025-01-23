import React, { useState, useEffect, useRef } from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem, ListItemText, Checkbox, FormControlLabel, Box, TextField, Autocomplete, Chip, Typography } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { config } from '../constant';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Import JSON data
// const fetchTitles = async () => {
//   const response = await import('../titles.json');
//   return response.default;
// };

const fetchLocations = async (query) => {
  const url = new URL(config.url.LOCATION_SEARCH_URL)
  url.searchParams.set('query', query)
  const response = await fetch(url)
  return response;
};

const FilterSection = ({ handleFilterSubmit }) => {
  const [filters, setFilters] = useState({
    minSalary: 0,
    minExperience: -1,
    maxExperience: -1,
    minEmployeeCount: -1,
    maxEmployeeCount: -1,
    //minStipend: 0,
    internship: false,
    workMode: ["Onsite", "Remote", "Hybrid"],
    keywords: [],
    jobTitles: [],
    locations: [],
    uploadedFiles: [],
    minTime: moment().subtract(7, 'days'),
    maxTime: moment()
  });

  //const [titleOptions, setTitleOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const fetchLocationsLatestId = useRef(1);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    setFilters((prev) => {
      return {...prev, uploadedFiles: [...prev.uploadedFiles, ...files]}
    });
  };
  
  const handleFileDelete = (fileToDelete) => {
    setFilters((prev) => {
      return {...prev, uploadedFiles: prev.uploadedFiles.filter(file => file !== fileToDelete)};
    });
  };

  const handleChangeKeywords = (event, keywords) => {
    setFilters(prev => {
      return {...prev, keywords: keywords}
    })
  }

  const handleMinTimeChange = (newValue) => {
    setFilters(prev => {
      return {...prev, minTime: newValue}
    })
  }

  const handleMaxTimeChange = (newValue) => {
    setFilters(prev => {
      return {...prev, maxTime: newValue}
    })
  }

  // useEffect(() => {
  //   fetchTitles().then(data => {
  //     // Convert JSON data into grouped options
  //     const formattedOptions = Object.entries(data).flatMap(([group, titles]) => 
  //       titles.map(title => ({ group, title }))
  //     );
      
  //     setTitleOptions(formattedOptions);
  //   });
  // }, []);

  useEffect(() => {
    setIsLocationLoading(true)
    setLocationOptions([])
    const id = fetchLocationsLatestId.current + 1;
    fetchLocationsLatestId.current = fetchLocationsLatestId.current + 1;
    
    fetchLocations(locationInput).then(res => {
      res.json().then(data => {
        if (id === fetchLocationsLatestId.current) {
          setLocationOptions(data)
          setIsLocationLoading(false)
        }
      })
    })
  }, [locationInput])

  const salary_options = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80];
  const exp_options = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20];
  //const stipend_options = [0, 1, 2, 3, 4, 5, 6];
  const work_mode_options = ['Onsite', 'Remote', 'Hybrid']
  const employee_count_options = [0, 10, 50, 100, 200, 500, 1000, 5000, 10000]

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  };

  // const handleJobTitleChange = (event, newValue) => {
  //   setFilters({ ...filters, jobTitles: newValue });
  // };

  const handleJobLocationChange = (event, newValue) => {
    setFilters({ ...filters, locations: newValue });
  };

  // Define icons for checkboxes
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Box sx={{ marginBottom: 2 }}>
      <form onSubmit={(event) => { handleFilterSubmit(event, filters) }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <Box border="1px solid #cccccc" p={2} borderRadius={1} display="flex" flexDirection="column" gap={2}>
            <Box gap={1} display="flex" alignItems="center" justifyContent="center" color="ButtonText">
              <AutoAwesomeIcon fontSize="small" style={{color: "#FFB330"}} />
              <Typography variant="button" fontWeight={600}>
                POWERED BY AI
              </Typography>
            </Box>

            <FormControl fullWidth>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload Resume(s)
                <input
                  type="file"
                  multiple
                  hidden
                  accept=".pdf,.docx,.txt"
                  files={filters.uploadedFiles}
                  onChange={handleFileUpload}
                />
              </Button>

              {/* Display uploaded files */}
              <Box>
                {filters.uploadedFiles.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleFileDelete(file)}
                    sx={{ margin: 0.5 }}
                  />
                ))}
              </Box>
            </FormControl>

            <FormControl fullWidth>
              <Autocomplete
                multiple
                options={[]}
                freeSolo
                onChange={handleChangeKeywords}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip variant="filled" label={option} key={key} {...tagProps} />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Keywords"
                    placeholder="eg: Engineer, Startup, Healthcare, Freshers"
                  />
                )}
              />
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Minimum Salary</InputLabel>
            <Select
              value={filters.minSalary}
              name="minSalary"
              label="Minimum Salary"
              onChange={handleFilterChange}
              MenuProps={{ style: { maxHeight: 400 } }}
            >
              {salary_options.map(salary => (
                <MenuItem key={salary} value={salary * 100000}>
                  {salary} lakhs+
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.internship}
                  onChange={handleFilterChange}
                  name="internship"
                />
              }
              label="Internship Only"
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Work Mode</InputLabel>
            <Select
              multiple
              value={filters.workMode}
              name="workMode"
              label="Work Mode"
              onChange={handleFilterChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {work_mode_options.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={filters.workMode.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Min Experience</InputLabel>
            <Select
              value={filters.minExperience}
              name="minExperience"
              label="Min Experience"
              onChange={handleFilterChange}
              MenuProps={{ style: { maxHeight: 400 } }}
            >
              <MenuItem value={-1}>Any</MenuItem>
              {exp_options.map(exp => (
                <MenuItem key={exp} value={exp}>
                  {exp + " years"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Max Experience</InputLabel>
            <Select
              value={filters.maxExperience}
              name="maxExperience"
              label="Max Experience"
              onChange={handleFilterChange}
              MenuProps={{ style: { maxHeight: 400 } }}
            >
              <MenuItem value={-1}>Any</MenuItem>
              {exp_options.map(exp => (
                <MenuItem key={exp} value={exp}>
                  {exp + " years"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Autocomplete
              multiple
              disableCloseOnSelect
              loading={isLocationLoading}
              options={locationOptions}
              inputValue={locationInput}
              onInputChange={(event, value, reason) => {
                if (reason === "input") {
                  setLocationInput(value);
                }
              }}
              onChange={handleJobLocationChange}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Locations" placeholder="Select locations" />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Min Employee Count</InputLabel>
            <Select
              value={filters.minEmployeeCount}
              name="minEmployeeCount"
              label="Min Employee Count"
              onChange={handleFilterChange}
              MenuProps={{ style: { maxHeight: 400 } }}
            >
              <MenuItem value={-1}>Any</MenuItem>
              {employee_count_options.map(exp => (
                <MenuItem key={exp} value={exp}>
                  {exp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Max Employee Count</InputLabel>
            <Select
              value={filters.maxEmployeeCount}
              name="maxEmployeeCount"
              label="Max Employee Count"
              onChange={handleFilterChange}
              MenuProps={{ style: { maxHeight: 400 } }}
            >
              <MenuItem value={-1}>Any</MenuItem>
              {employee_count_options.map(exp => (
                <MenuItem key={exp} value={exp}>
                  {exp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker label="Jobs after" minDate={moment().subtract(7, 'days')} maxDate={moment()} value={filters.minTime} onChange={handleMinTimeChange}/>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker label="Jobs before" minDate={moment().subtract(7, 'days')} maxDate={moment()} value={filters.maxTime} onChange={handleMaxTimeChange} />
          </LocalizationProvider>

          <Button type="submit" variant="contained">Apply Filters</Button>
        </Box>
      </form>
    </Box>
  );
};

export default FilterSection;
