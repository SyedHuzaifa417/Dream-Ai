"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MasonryGrid from "../../components/MasonryGrid";

const sampleImages = [
  {
    url: "https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    url: "https://s3-alpha-sig.figma.com/img/f5e5/3898/be38ec29cc389508fd1378bcbfd12759?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oIscxHGhhz5M2EdN5eI4Yk~fPIcVuFY1YSrZPBRBBAOXN7PNQWiYlzE6c0mw4Hkd1KCcEv0r79O0xivLxTdui8eFqvlNgIpfpAk2W6QpUhnkak0tEojX1FtH2ZeMQq6vn54MQ2otywzK4V5dZPZ-FXzB-DbSr77GEILNR08g44EPVxbH8LGyQq-69qcXUiaRcohD8OUv1qJgeVAYgeIZhdBV8c1Ad7NUDNkbDFmUi9zWT1GGnDJ11vZxVYBHjCy0sDfSDLKCRMyp3vOP6ZSt~vJcibE7KPIx0w47WFm59uf7DkcJhcIWACIaGKhac-rqhXRIbppky0z9zFeGSWynew__",
  },
  {
    url: "https://s3-alpha-sig.figma.com/img/4326/ceae/958aeec63337ae3d19b4f45808e31c4a?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Wiqa7qwFCK5VASo-wFkmOYyNybd-OCarhp3o1OiHshWaFod9sFTMx9xOOZ9BBj9lGk1xt6fq3DZxPpeEM~FwqFyG8pKNa3wA8WfBTgj9y6SqHtftFTMRYOlV2uVlLFZ5FAtbdgOLDxZ-Hool97V07f-Vb-mXnwVIZiT3OzWy45PPXHJORxpyAGrICEjNDg5K3kmxaxgskw61PTH~J3b7tPa8CYb0qCpLIG90RfzNeKm3Ps7WcIETZM4x58qhtTx9ymeg0oVY3mWer7RgB862S5AMi5NuNR6fxieHExJwW-PrcxD7fSMtliGKKSJQQHm5RTNWAefZhN5doQwQa-v5Uw__",
  },
  {
    url: "https://s3-alpha-sig.figma.com/img/891f/f665/4cabb52b14cb062ef4178cdbf1e04781?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PzaRre0nkw1KM-inermkip96p4JVNIp5ZYtAAEuJiN7oh1xGxiFmWnvn6dCY7u9zk~SWSzVSlXv2R36ap0UAQcswVhtuQkv5nUkDP0yEsDcNA92S2cM-4Oe0uDehTPHhQulewiHGyC-CUmxmxTxdN0UF-y3FYRSctKF0g7dV6ITgUi16XNRQgPRmh0ucJzm0aRhy-RhCH2JUfO8Jz~oYDG9xXzFQogyuVkLLvjy57yQKU3AU5SCpAbKzlgsa77L7MpSkKmsQ2F211P26EcX5mCOAupawCudMgmK4U0H68CQAsG~U4palYQexLtmdYJ5MLjJBGC3iEfZi7zhOYSqBPw__",
  },
  {
    url: "https://images.unsplash.com/photo-1682687981922-7b55dbb30892?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    url: "https://images.unsplash.com/photo-1682685797886-79020b7462a4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    url: "https://dims.apnews.com/dims4/default/8027b06/2147483647/strip/true/crop/1408x1024+0+0/resize/599x436!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fa1%2Fdf%2Fd49ae1558ea3ab7646cac4109a3f%2Fd1e4987589234088a9876659052f7cb2",
  },
  {
    url: "https://121clicks.com/wp-content/uploads/2023/06/ai-generated-animal-crossbreeds-10.jpg",
  },
  {
    url: "https://miro.medium.com/v2/resize:fit:2000/1*DMntxu5mexKyUdbqlEq6Xg.jpeg",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9JpD48Z4yd_EIlt5K3yAFeAwPvVoonoae4Q&s",
  },
  {
    url: "https://p.potaufeu.asahi.com/1831-p/picture/27695628/89644a996fdd0cfc9e06398c64320fbe.jpg",
  },
  {
    url: "https://i0.wp.com/keepcalmandcrochetonuk.com/wp-content/uploads/2024/06/KCACOUKBlog-Navigating-AI-Generated-Crochet_04.jpg?ssl=1",
  },
];

export default function ImageGrid() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const mediaItems = sampleImages.map((item, index) => {
    return (
      <div key={index} className="relative overflow-hidden rounded-lg mb-2">
        <Image
          src={item.url}
          alt={`Generated image ${index + 1}`}
          width={800}
          height={800}
          className="w-full h-auto rounded-lg transition-transform hover:scale-105"
        />
      </div>
    );
  });

  return (
    <MasonryGrid loading={loading} loadingMessage="Loading amazing images...">
      {mediaItems}
    </MasonryGrid>
  );
}
