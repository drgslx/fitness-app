from io import BytesIO
from PIL import Image
from test_articles import client
from app.main import app
from app.core.security import current_user
from app.core.config import settings

def png():
    output=BytesIO()
    Image.new("RGB",(10,10),"green").save(output,format="PNG")
    return output.getvalue()

def test_two_images_and_spoofed_upload(client, tmp_path, monkeypatch):
    test,_=client
    monkeypatch.setattr(settings,"upload_dir",str(tmp_path))
    app.dependency_overrides[current_user]=lambda:{"uid":"admin","admin":True}
    form={"title":"Images test","summary":"Summary with enough text","content":"Content with more than twenty characters."}
    files=[("images",("one.png",png(),"image/png")),("images",("two.png",png(),"image/png"))]
    response=test.post("/api/v1/articles",data=form,files=files)
    assert response.status_code==201,response.text
    assert len(response.json()["images"])==2
    for image in response.json()["images"]:
        result=test.get(image["url"])
        assert result.status_code==200
        assert result.headers["content-type"]=="image/webp"
    assert test.post("/api/v1/articles",data=form,files=files+[files[0]]).status_code==422
    assert test.post("/api/v1/articles",data=form,files={"images":("fake.png",b"not an image","image/png")}).status_code==415
