const cv = require("opencv.js")
import * as tf from '@tensorflow/tfjs'

export default function getDigitsFromImg(imgId) {
    let img = cv.imread(imgId)
    cv.imshow('canvasOutput', img);

    const board = findSudokuBoard(img)
    const boxes = splitBoxes(board)

    // tf.load_model('model-OCR.h5')
}

function splitBoxes(img) {
    const boxes = []
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            const box = img.rowRange(i * img.rows / 9, (i + 1) * img.rows / 9)
                           .colRange(j * img.rows / 9, (j + 1) * img.rows / 9)
            
            cv.resize(box, box, new cv.Size(48, 48))
            boxes.push(box)
        }
    }
    return boxes
}

function getContours(img) {
    const gray = new cv.Mat()
    cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY)
    const bilateral = new cv.Mat()
    cv.bilateralFilter(gray, bilateral, 13, 20, 20)
    cv.Canny(bilateral, bilateral, 30, 180)
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(bilateral, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    
    return contours
}

function findBoardCorners(img) {
    const contours = getContours(img)

    const areas = []
    const cnts = []
    for (let i = 0; i < contours.size(); ++i) {
        const c = contours.get(i)
        let area = cv.contourArea(c)
        areas.push(area)
        cnts.push(c)
    }

    const max = Math.max(...areas)
    const maxIndex = areas.indexOf(max)

    const approx = new cv.Mat()
    const peri = cv.arcLength(cnts[maxIndex], true)
    cv.approxPolyDP(cnts[maxIndex], approx, peri * 0.01, true)
    if (approx.data32S.length === 8) {
        return approx.data32S
    }
    return []
}

function setProperCornersOrder(corners) {
    reverseCornersOrder(corners)
    let iterations = 0
    while (!isGoodCornersOrder(corners)) {
        corners.unshift(corners.pop())
        corners.unshift(corners.pop())
        ++iterations
        if (iterations > 4) {
            break
        }
    }
}

function findSudokuBoard(img) {
    let corners = findBoardCorners(img)
    corners = Array.from(corners)
    if (corners.length === 0) {
        return img
    }
    
    setProperCornersOrder(corners)
    const srcMat = new cv.matFromArray(4, 1, cv.CV_32FC2, corners)
    const destMat = new cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 900, 0, 900, 900, 0, 900])

    const p = cv.getPerspectiveTransform(srcMat, destMat)
    const newImg = new cv.Mat(new cv.Size(900, 900), img.type())
    cv.warpPerspective(img, newImg, p, newImg.size())
    return newImg
}

function isGoodCornersOrder(corners) {
    return (corners[0] < corners[2]) && (corners[0] < corners[4]) && (corners[1] < corners[5]) && (corners[1] < corners[7]) &&
           (corners[2] > corners[6]) && (corners[3] < corners[5]) && (corners[3] < corners[7]) &&
           (corners[4] > corners[6])
}

function reverseCornersOrder(corners) {
    const tmp = []
    while (corners.length > 0) {
        tmp.push(corners.splice(0, 2))
    }
    while (tmp.length > 0) {
        corners.push(tmp.at(-1)[0])
        corners.push(tmp.at(-1)[1])
        tmp.pop()
    }
}

function deskewImage(img) {
    const contours = getContours(img)
    const areas = []
    for (let i = 0; i < contours.size(); ++i) {
        const c = contours.get(i)
        let area = cv.contourArea(c)
        areas.push(area)
    }

    if (areas.length === 0) {
        return img
    }

    const d = Math.max(...areas)
    let minAreaRect = cv.minAreaRect(contours.get(areas.indexOf(d)))
    let angle = minAreaRect.angle
    if (angle < 45) {
        angle = -angle
    } else {
        angle = -(angle - 90)
    }

    const rot = cv.getRotationMatrix2D(minAreaRect.center, angle, 1)
    const dst = new cv.Mat(img.size(), img.type())
    cv.warpAffine(img, dst, rot, dst.size(), cv.WARP_INVERSE_MAP | cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar())
    return dst
}
