import { useCategories } from '@/app/hooks/use-categories';
import { Category } from '@/types/categories';
import { Autocomplete, AutocompleteOption, FormControl, FormLabel, createFilterOptions } from '@mui/joy';
import React, { useEffect } from 'react';
import { useAlert } from '../Wrappers/alert-wrapper';

interface Props {
  selected: Category | null;
  setSelected(value: Category): void;
}

export const AutocompleteAndAdd: React.FC<Props> = ({ selected, setSelected }) => {
  const { categories, isLoading, isError } = useCategories();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (isError) {
      showAlert({
        message: 'There was an error loading categories.',
        severity: 'danger',
        duration: 5000,
      });
    }
  }, [isError]);
  return (
    <>
      <FormControl size="sm" id="category">
        <FormLabel className="dark:text-white text-black ">Select a Category</FormLabel>
        <Autocomplete
          multiple={false}
          placeholder="Select a category"
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
