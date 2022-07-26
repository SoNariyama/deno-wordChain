import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let defaultWord = ['あじさい', 'いおう','うろおぼえ','えがお','おかか','かじき','きく','くらんけ','けいこ','こんでんさ','さくし','しらす','すりあわせ','せいそ','そなた','たちうち','ちかてつ','ついたて','てきすと','とだな','ないたあかおに','にたやまぎぬ','ぬけぶね','ねりもの','のこぎりは','はんそうはたいざつおんひ','ひえろぐりふ','ふなのへ','へいほ','ほしのおうじさま','まいあみ','みゅーじあむ','むらさめ','めも','もろへいや','やしゆ','ゆうよ','よくづら','らーげり','りべらる','るちゃぶれ','れしぷろ','ろんりわ','わとそにあ'];
var previousWord = defaultWord[getRandomInt(defaultWord.length-1)]
var alertTimer = null;

console.log("Listening on http://localhost:8000");

serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);
    let usedWords = [JSON.stringify(previousWord)];
    usedWords[usedWords.length]=JSON.stringify(previousWord);
    console.log(usedWords);
    
    if (req.method === "GET" && pathname === "/shiritori") {
        return new Response(previousWord);
    }
    if (req.method === "POST" && pathname === "/shiritori") {
        const requestJson = await req.json();
        const nextWord = requestJson.nextWord;

        var alertmsg = setInterval(function(){
            return new Response("10秒経過しました。終了です。",{status:400});
        }, 10000);

        if (nextWord.length <= 0) {
                if (alertTimer) {
            clearTimeout(alertTimer);
        }
            return new Response("未入力です。", { status: 400 });
        }
        if (nextWord.length > 0 && nextWord.charAt(nextWord.length - 1) !== previousWord.charAt(0)) {
            if (alertTimer) {
                clearTimeout(alertTimer);
            }
            return new Response("前の単語に続いていません。", { status: 400 });
        }
        //本来の実装 ↓
        //  本来の入力チェック
        /*if (nextWord.length > 0 && previousWord.charAt(previous.length - 1) !== nextWord.charAt(0)) {
            return new Response("前の単語に続いていません。", { status: 400 });
        }/*
        //  "ん"の判定
        /*if (nextWord.charAt(nextWord.length - 1) === "ん") {
            return new Response("「ん」が付きました。", { status: 400 });
        }*/
        if (usedWords.includes(nextWord)) {
            if (alertTimer) {
                clearTimeout(alertTimer);
            }
            return new Response("同じ単語を2度入力しました。", { status: 400 });
        }
        previousWord = nextWord;
        clearInterval(alertmsg);
        if (alertTimer) {
            clearTimeout(alertTimer);
        }
        return new Response(previousWord);
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});