import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Form, Table } from 'semantic-ui-react';

export type TPeople = {
  birth_year: string;
  created: string;
  edited: string;
  eye_color: string;
  films: Array<string>;
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
  species: Array<string>;
  starships: Array<string>;
  url: string;
  vehicles: Array<string>;
}

export type TResponseData = {
  count: number;
  next: string;
  previous: string | null;
  results: Array<TPeople>;
};

function App() {
  const [rows, setRows] = useState<Array<TPeople>>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [next, setNext] = useState<string>('');
  const [totalFetched, setTotalFetched] = useState(0);
  const [query, setQuery] = useState<string>('');

  const fetcher = (url: string) => {
    const promise = axios.get(url);
    const data = promise.then((res) => res.data);

    return data;
  }

  const resetState = () => {
    setRows([]);
    setTotalFetched(0);
    setTotalRows(0);
    setNext('');
  }

  useEffect(() => {
    initFetch();
  }, []);

  const initFetch = () => {
    fetcher('https://swapi.dev/api/people/')
      .then((data: TResponseData) => {
        setRows(prevRows => [...prevRows, ...data.results]);
        setTotalRows(data.count);
        setTotalFetched(totalFetched + data.results.length);
        setNext(data.next);
      });
  }

  const handleNext = () => {
    if (next !== null) {
      fetcher(next)
        .then((data: TResponseData) => {
          setRows(prevRows => [...prevRows, ...data.results]);
          setTotalFetched(totalFetched + data.results.length);
          setNext(data.next);
        });
    }
  }

  const handleSearch = () => {
    resetState();
    if (query === '') {
      initFetch();
    } else {
      fetcher(`https://swapi.dev/api/people/?search=${query}`)
        .then((data: TResponseData) => {
          setRows(prevRows => [...prevRows, ...data.results]);
          setTotalRows(data.count);
          setTotalFetched(totalFetched + data.results.length);
          setNext(data.next);
        });
    }

  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div id={"scrollableDiv"} style={{ margin: 20, height: 500, overflowY: 'scroll' }}>
        <div style={{ marginBottom: 20 }}>
          <Form.Input placeholder={'Search...'} value={query} onChange={(e, val) => { setQuery(val.value) }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Button onClick={() => { handleSearch() }}>{'Search'}</Button>
        </div>
        <InfiniteScroll
          dataLength={rows.length}
          next={handleNext}
          hasMore={totalFetched < totalRows}
          loader={<h4>Loading...</h4>}
          scrollableTarget='scrollableDiv'
          endMessage={<h4>All Data Loaded!</h4>}
        >
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{'No.'}</Table.HeaderCell>
                <Table.HeaderCell>{'Name'}</Table.HeaderCell>
                <Table.HeaderCell>{'Birth Year'}</Table.HeaderCell>
                <Table.HeaderCell>{'URL'}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.length != 0 && rows.map((row, index) => (
                <Table.Row key={`list-${index}`}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.birth_year}</Table.Cell>
                  <Table.Cell>{row.url}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default App;
