import GameCard from '@/components/GameCard';

export default function Home() {
  const games = [
    {
      title: "던전앤파이터",
      description: "던전앤파이터는 넥슨에서 개발한 2D 횡스크롤 액션 RPG 게임입니다. 다양한 직업과 스킬, 던전 탐험을 통해 캐릭터를 성장시킬 수 있습니다.",
      imageUrl: "https://bbscdn.df.nexon.com/data6/commu/202504/0a536ffe-b27e-f519-88ec-41f7679cd035.jpg",
      link: "/dnf"
    },
    {
      title: "메이플스토리",
      description: "메이플스토리는 넥슨에서 개발한 2D 사이드뷰 MMORPG 게임입니다. 다양한 직업군과 스토리, 보스 레이드를 통해 캐릭터를 육성할 수 있습니다.",
      imageUrl: "https://lwi.nexon.com/maplestory/common/media/artwork/artwork_114.jpg",
      link: "/maplestory"
    },
    {
      title: "로스트아크",
      description: "로스트아크는 스마일게이트에서 개발한 3D 액션 MMORPG 게임입니다. 화려한 전투와 다양한 콘텐츠를 통해 캐릭터를 성장시킬 수 있습니다.",
      imageUrl: "https://cdn.sisajournal-e.com/news/photo/first/201811/img_191321_1.png",
      link: "/lostark"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* 헤더 섹션 */}
      <header className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">게임 캐릭터 정보 조회</h1>
          <p className="text-center text-gray-600">던전앤파이터, 메이플스토리, 로스트아크 캐릭터 정보를 한 곳에서 확인하세요</p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game) => (
            <GameCard
              key={game.title}
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
              link={game.link}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
