"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const sampleImages = [
  "https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=1000&auto=format&fit=crop",
  "https://s3-alpha-sig.figma.com/img/f5e5/3898/be38ec29cc389508fd1378bcbfd12759?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oIscxHGhhz5M2EdN5eI4Yk~fPIcVuFY1YSrZPBRBBAOXN7PNQWiYlzE6c0mw4Hkd1KCcEv0r79O0xivLxTdui8eFqvlNgIpfpAk2W6QpUhnkak0tEojX1FtH2ZeMQq6vn54MQ2otywzK4V5dZPZ-FXzB-DbSr77GEILNR08g44EPVxbH8LGyQq-69qcXUiaRcohD8OUv1qJgeVAYgeIZhdBV8c1Ad7NUDNkbDFmUi9zWT1GGnDJ11vZxVYBHjCy0sDfSDLKCRMyp3vOP6ZSt~vJcibE7KPIx0w47WFm59uf7DkcJhcIWACIaGKhac-rqhXRIbppky0z9zFeGSWynew__",
  "https://s3-alpha-sig.figma.com/img/4326/ceae/958aeec63337ae3d19b4f45808e31c4a?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Wiqa7qwFCK5VASo-wFkmOYyNybd-OCarhp3o1OiHshWaFod9sFTMx9xOOZ9BBj9lGk1xt6fq3DZxPpeEM~FwqFyG8pKNa3wA8WfBTgj9y6SqHtftFTMRYOlV2uVlLFZ5FAtbdgOLDxZ-Hool97V07f-Vb-mXnwVIZiT3OzWy45PPXHJORxpyAGrICEjNDg5K3kmxaxgskw61PTH~J3b7tPa8CYb0qCpLIG90RfzNeKm3Ps7WcIETZM4x58qhtTx9ymeg0oVY3mWer7RgB862S5AMi5NuNR6fxieHExJwW-PrcxD7fSMtliGKKSJQQHm5RTNWAefZhN5doQwQa-v5Uw__",
];

export default function ImageGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sampleImages.map((url, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={url}
              alt={`Generated image ${index + 1}`}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
