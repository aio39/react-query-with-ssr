import { useQuery } from "react-query";

type createResourceParam = {
  key: string;
  fetcher: () => Promise<Response>;
};

const customFetch = async (path: string) => {
  return fetch(`http://localhost:3000/${path}`).then((res) => res.json());
};

function createResource({ key, fetcher }: createResourceParam) {
  return { key, fetcher };
}

const data1Resource = createResource({
  key: "data1",
  fetcher: async () => {
    return customFetch("api/data1");
  },
});

const data2Resource = createResource({
  key: "data2",
  fetcher: async () => {
    return customFetch("api/data2");
  },
});

function useResource({ key, fetcher }: ReturnType<typeof createResource>) {
  return useQuery({
    queryKey: key,
    queryFn: fetcher,
    staleTime: Infinity,
  });
}

export default function Page() {
  return (
    <main>
      <ComponentA />
    </main>
  );
}

Page.requiredResources = [data1Resource, data2Resource];

function ComponentA() {
  const { data: data1 } = useResource(data1Resource);
  return (
    <>
      <div>{data1.data}</div>
      <ComponentB />
    </>
  );
}

function ComponentB() {
  const { data: data2 } = useResource(data2Resource);
  return (
    <>
      <div>{data2.data}</div>
    </>
  );
}
