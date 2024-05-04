
const Page = async ({ params }: { params: { id: string } }) => {

  console.log(params.id)

  return (
    <div>
      <h1>{}</h1>
    </div>
  );
}

export default Page;
