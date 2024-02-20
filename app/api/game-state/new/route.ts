export const GET = async (request: string): Promise<Response> => {
    try {
      const area: Record<string, number> = { blue: 40, red: 60 };
      const users: Record<string, string[]> = {
        blue: [
          "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/b2ad1e4bd94c395727afc6ee082b7369~c5_100x100.webp?x-expires=1692226800&x-signature=F0WQZgYObludFc4UaxUUWQ80FGA%3D",
          "https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1646591872952326~c5_100x100.webp?x-expires=1692226800&x-signature=bqP%2Bg3WiludYbPpAL5HwAKhFvi4%3D",
          "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/27a3631be4f978c9e9725c283e3ddcdb~c5_100x100.webp?x-expires=1692226800&x-signature=uGm9bHm%2FbBV8mKhKqte8RSAG%2BdQ%3D",
          "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7a7222c76f247ac8b525f5cff9500d05~c5_100x100.webp?x-expires=1692226800&x-signature=tVfha0PBTOgCYlvH6pPkWaZBgVM%3D",
          "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/4214befafdd44224f25cc2fcef26c9eb.webp?x-expires=1692226800&x-signature=pdJy60oS0gn35EqX9tWNuwL7gYQ%3D",
          "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/6aa6f66c8d13aa6e3d580f409b69d290~c5_100x100.webp?x-expires=1692226800&x-signature=%2B8kwt2gjCYzcTNQuH1fYpSOD9xA%3D",
          "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/8423c4e79828a13bdd530a4114dc1295.webp?x-expires=1692226800&x-signature=oab2S1iql%2Bs5QXKUoRLZJ1iCUCs%3D",
        ],
        red: [
          "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/b2ad1e4bd94c395727afc6ee082b7369~c5_100x100.webp?x-expires=1692226800&x-signature=F0WQZgYObludFc4UaxUUWQ80FGA%3D",
          "https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1646591872952326~c5_100x100.webp?x-expires=1692226800&x-signature=bqP%2Bg3WiludYbPpAL5HwAKhFvi4%3D",
          "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/27a3631be4f978c9e9725c283e3ddcdb~c5_100x100.webp?x-expires=1692226800&x-signature=uGm9bHm%2FbBV8mKhKqte8RSAG%2BdQ%3D",
          "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7a7222c76f247ac8b525f5cff9500d05~c5_100x100.webp?x-expires=1692226800&x-signature=tVfha0PBTOgCYlvH6pPkWaZBgVM%3D",
          "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/4214befafdd44224f25cc2fcef26c9eb.webp?x-expires=1692226800&x-signature=pdJy60oS0gn35EqX9tWNuwL7gYQ%3D",
          "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/6aa6f66c8d13aa6e3d580f409b69d290~c5_100x100.webp?x-expires=1692226800&x-signature=%2B8kwt2gjCYzcTNQuH1fYpSOD9xA%3D",
          "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/8423c4e79828a13bdd530a4114dc1295.webp?x-expires=1692226800&x-signature=oab2S1iql%2Bs5QXKUoRLZJ1iCUCs%3D",
        ],
      };
      return new Response(JSON.stringify({ area: area, users: users }), {
        status: 200,
      });
    } catch (error) {
      return new Response("Failed to fetch user", { status: 500 });
    }
  };
  