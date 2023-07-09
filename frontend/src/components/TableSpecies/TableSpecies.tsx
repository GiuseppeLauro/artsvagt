import useFetchSpecies from '@/hooks/useFetchSpecies';
import {
  Table,
  Container,
  Skeleton,
  Pagination,
  ScrollArea,
  Badge,
  Button,
  Grid,
  Select,
} from '@mantine/core';
import { useState } from 'react';
import useStyles from './TableSpecies.styles';
import { SpeciesType } from '@/types/SpeciesType';
import { classSpecies, category } from '@/utils';
import { FileSearch } from 'tabler-icons-react';
import { Region } from '../Region/Region';

interface TableSpeciesProps {
  region: string;
  handleOpenDrawer?: (taxonId: number) => void;
}

function TableSpecies({ region, handleOpenDrawer }: TableSpeciesProps) {
  const { classes, cx } = useStyles();
  const [page, setPage] = useState(0);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data, loading, error } = useFetchSpecies(
    region,
    page,
    selectedCategory,
    selectedClass
  );

  if (error) {
    return <div>{error}</div>;
  }

  const selectClassSpecies = Object.entries(classSpecies).map(
    ([key, value]) => ({
      value: key,
      label: `${value}  ${key}`,
    })
  );

  selectClassSpecies.unshift({ value: 'all', label: 'All' });

  const selectCategory = Object.entries(category).map(([key, value]) => ({
    value: key,
    label: (value as { text: string }).text,
  }));

  selectCategory.unshift({ value: 'all', label: 'All' });

  return (
    <Container>
      <Grid mb="md">
        <Grid.Col span={4} md={6}>
          <Region
            name={region}
            identifier={region}
            image={'/' + region + '.png'}
            readonly={true}
          />
        </Grid.Col>
        <Grid.Col span={4} md={6}>
          <Select
            defaultValue={'all'}
            label="Select Category"
            placeholder="Pick one"
            data={selectCategory}
            onChange={(value) => setSelectedCategory(value ?? 'all')}
          />
        </Grid.Col>
        <Grid.Col span={4} md={6}>
          <Select
            defaultValue={'all'}
            label="Select Class Name"
            placeholder="Pick one"
            data={selectClassSpecies}
            onChange={(value) => setSelectedClass(value ?? 'all')}
          />
        </Grid.Col>
      </Grid>
      <ScrollArea h={500}>
        <Table h={500} striped highlightOnHover withBorder>
          <thead className={classes.header}>
            <tr>
              <th>Class Name</th>
              <th>Scientific Name</th>
              <th>Category</th>
              <th>&ensp;</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(4)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton height={10} mt={6} radius="xl" />
                    </td>
                    <td>
                      <Skeleton height={10} mt={6} radius="xl" />
                    </td>
                    <td>
                      <Skeleton height={10} mt={6} radius="xl" />
                    </td>
                    <td>
                      <Skeleton height={10} mt={6} radius="xl" />
                    </td>
                  </tr>
                ))
              : data.result.map((species: SpeciesType, index: number) => (
                  <tr key={index}>
                    <td>
                      {classSpecies[species.class_name] +
                        ' ' +
                        species.class_name}
                    </td>
                    <td>{species.scientific_name}</td>
                    <td>
                      <Badge
                        color={
                          category[species.category]
                            ? category[species.category]['color']
                            : 'gray'
                        }
                        variant="outline"
                      >
                        {category[species.category]
                          ? category[species.category]['text']
                          : species.category}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline"
                        leftIcon={<FileSearch size="1rem" />}
                        onClick={() => {
                          handleOpenDrawer && handleOpenDrawer(species.taxonid);
                        }}
                      >
                        View Data
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </ScrollArea>
      <Pagination
        size={'md'}
        total={data.max_pages}
        siblings={data.current_page + 1}
        color="dark"
        mt="xl"
        withControls={false}
        defaultValue={1}
        onChange={(value) => setPage(value - 1)}
      />
    </Container>
  );
}

export default TableSpecies;
