import { useCategories } from '@/app/hooks/use-categories';
import { Category } from '@/types/categories';
import { Autocomplete, AutocompleteOption, FormControl, FormLabel, createFilterOptions } from '@mui/joy';
import React from 'react';
import { useAlertStore } from '../Wrappers/alert-wrapper';

export const AutocompleteCategory: React.FC = () => {
  const [selected, setSelected] = React.useState<Category | null>(null);
  const { categories, isLoading, isError } = useCategories();
  const { showAlert } = useAlertStore();

  return (
    <>
      <FormControl size="sm" id="category">
        <FormLabel className="dark:text-white text-black ">Select a Category</FormLabel>
        <Autocomplete
          multiple={false}
          placeholder="Select a category"
          name="category"
          autoComplete={true}
          options={categories ?? []}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelected(newValue);
            }
          }}
          loading={isLoading}
          loadingText="Loading categories..."
          filterOptions={createFilterOptions<Category>()}
          clearOnBlur
          handleHomeEndKeys
          defaultValue={null}
          autoHighlight
          autoCapitalize={'on'}
          value={selected}
          renderOption={(props, option) => (
            <AutocompleteOption {...props} key={option.id + 'category'}>
              {option.name}
            </AutocompleteOption>
          )}
        />
      </FormControl>
    </>
  );
};
