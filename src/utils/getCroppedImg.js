// cropUtils.js
export const getCroppedImg = (imageSrc, crop, zoom) => {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = 'anonymous'; // Permite accesul CORS
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const cropWidth = crop.width * zoom;
            const cropHeight = crop.height * zoom;
            
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            
            ctx.drawImage(
                image,
                crop.x,
                crop.y,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight
            );
            
            resolve(canvas.toDataURL('image/jpeg'));
        };
    });
};
