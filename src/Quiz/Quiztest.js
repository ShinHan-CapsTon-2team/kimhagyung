import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; 

// 이미지 퀴즈  json 파일 
import quizbody from '../Datajson/bodydata.json';
import quizpet from '../Datajson/petdata.json';
import quizwedding from '../Datajson/weddingdata.json';
import quizfamily from '../Datajson/familydata.json';
import quizprofile from '../Datajson/profiledata.json';

import styled from "styled-components";

const getQuizbody = () => {
    return quizbody;
};

const getQuizpet = () => {
    return quizpet;
};

const getQuizwedding = () => {
    return quizwedding;
};

const getQuizfamily = () => {
    return quizfamily;
};
const getQuizprofile = () => {
    return quizprofile;
};





const QuizTest = () => {

    const OutWrap = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

    const InsideWrap = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 50px;
    `;

    const Img = styled.img`
        width: 567px;
        height: 670px;
        margin-right: 50px;
    `;




    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const categoryName = params.get('name');

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    let questions = [];
    if (categoryName === 'body') {
        questions = getQuizbody();
    } else if (categoryName === 'pet') {
        questions = getQuizpet();
    }else if (categoryName === 'wedding') {
        questions = getQuizwedding();
    }else if (categoryName === 'family') {
        questions = getQuizfamily();
    }else if (categoryName === 'profile') {
        questions = getQuizprofile();
    }
    
    const [answers, setAnswers] = useState([]);
    const [num, setNum] = useState(searchParams.get("res")?.length ?? 0);



    useEffect(() => {
        const len = searchParams.get("res")?.length ?? 0;
        setAnswers(searchParams.get("res")?.split('') ?? []);

        if (len >= 3) {
            navigate("/quizresult?" + searchParams.toString());
        }
        /*
        if (len < 3) {
            setNum(searchParams.get("res")?.length ?? 0);
        } else {
            navigate("/result?" + searchParams.toString());
        }*/
    }, [searchParams, navigate]);

    const handleAnswer = (option) => {
        const a = [...answers, option.type];
        setAnswers(a);
        searchParams.set("res", a.join(''));
        setSearchParams(searchParams);
        setNum(a.length);
    };

    if (questions.length === 0) {
        return <div>선택한 카테고리에 대한 질문이 없습니다.</div>;
        }
        
    if (num >= questions.length) {
        return <div>모든 질문에 답변하셨습니다.</div>;
        }
        
    return (
        <OutWrap>
            <InsideWrap>
                <ul>
                    {questions[num].options.map((option, index) => (
                        <Img
                            key={index}
                            src={`${process.env.PUBLIC_URL}/Images/${option.img}`}
                            alt={`Option ${index + 1}`}
                            onClick={() => handleAnswer(option)}
                        />
                    ))}
                </ul>
            </InsideWrap>
        </OutWrap>
    


    );
};

export default QuizTest;
