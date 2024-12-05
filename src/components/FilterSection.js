import React, { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Box, TextField, Autocomplete, Chip } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { config } from '../constant';

// Import JSON data
const fetchTitles = async () => {
  const response = await import('../titles.json');
  return response.default;
};

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
    minStipend: 0,
    internship: false,
    remote: false,
    jobTitles: [],
    locations: [],
    uploadedFiles: []
  });

  const [titleOptions, setTitleOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationInput, setLocationInput] = useState("");

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

  useEffect(() => {
    fetchTitles().then(data => {
      // Convert JSON data into grouped options
      const formattedOptions = Object.entries(data).flatMap(([group, titles]) => 
        titles.map(title => ({ group, title }))
      );
      
      setTitleOptions(formattedOptions);
    });
  }, []);

  useEffect(() => {
    fetchLocations(locationInput).then(res => {
      res.json().then(data => {
        setLocationOptions(data)
      })
    })
  }, [locationInput])

  const salary_options = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80];
  const exp_options = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20];
  const stipend_options = [0, 1, 2, 3, 4, 5, 6];

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  };

  const handleJobTitleChange = (event, newValue) => {
    setFilters({ ...filters, jobTitles: newValue });
  };

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
            <Box sx={{ marginTop: 2, marginBottom: 2 }}>
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.remote}
                  onChange={handleFilterChange}
                  name="remote"
                />
              }
              label="Remote Only"
            />
          </Box>

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
                  {exp}
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
                  {exp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Minimum Stipend</InputLabel>
            <Select
              value={filters.minStipend}
              name="minStipend"
              label="Minimum Stipend"
              onChange={handleFilterChange}
              MenuProps={{ style: { maxHeight: 400 } }}
            >
              {stipend_options.map(stipend => (
                <MenuItem key={stipend} value={stipend * 100000}>
                  {stipend} lakhs+
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={titleOptions}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => option.title}
              value={filters.jobTitles}
              onChange={handleJobTitleChange}
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
                    {option.title}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Job Titles" placeholder="Select job titles" />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={locationOptions}
              inputValue={locationInput}
              onInputChange={(event, value) => {
                setLocationInput(value)
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
          <Button type="submit" variant="contained">Apply Filters</Button>
        </Box>
      </form>
    </Box>
  );
};

export default FilterSection;
