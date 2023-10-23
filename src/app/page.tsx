import { MainEntry } from './components/MainEntry'


const OPENSOURCE_LINK = 
	"https://portfolio-brian.fly.dev/opensource";


const sleep = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export type PR = {
	title: string,
	img: string,
	updated_at: string,
	org_icon: string
}

export default async function Home() {
  let prs: PR[] | undefined = undefined;
  let wait = 0;
  while(prs===undefined){
	await sleep(wait)
	try{
	  
	  //revalidate every 12 hours
	  const resp = await fetch(OPENSOURCE_LINK, {next: {revalidate: 6000*12}})
	  if(resp.status != 200){
		wait+=300
		continue
	  }

	  prs = await resp.json()
	}catch(e){
	  wait+=200
	  continue;
	}
  }
  return (
    <MainEntry prs={prs}/>
  )
}
