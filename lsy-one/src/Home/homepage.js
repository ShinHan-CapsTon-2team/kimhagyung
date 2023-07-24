import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import logo from '../Images/imagelogo.png';
import family from '../Images/image 9.png';
import pet from '../Images/image 10.png';
import profile from '../Images/image 11.png';
import wedding from '../Images/image 12.png';
import body from '../Images/image 13.png';

import styled from "styled-components";

const Homepage = () => {
  const [currentPage, setCurrentPage] = useState('');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    setCurrentPage(category);
  }, [location.search]);

  const handleCategoryClick = (category) => {
    const searchParams = new URLSearchParams();
    searchParams.set('category', category);
    const search = searchParams.toString();
    window.location.href = `/?${search}`; // 수정
  };


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
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
  `;
  
  const Logo = styled.img`
      width: 55%;
      height: 174px;
      margin-top: 20px;
      margin-bottom: 20px;
      object-fit: contain;
  `;
  
  const CategoryWrap = styled.div``;

  const CategoryImg = styled.img`
      width: 228.43px;
      height: 58px;
      margin-right: 30px;
  `;

  const GridWrap = styled.div`
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 10px;
      width: 100%;
      height: 100vh;
      padding: 20px;
  `;
  
  const GridDiv = styled.div`
      width: 100%;
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
  `;
  
  const GridImg = styled.img`
      width: 100%;
      height: 100%;
      object-fit: cover;
  `;
  

  return (
    <OutWrap>
      <InsideWrap>
        <Logo src={logo} alt=''/>
        <CategoryWrap>
          <CategoryImg
              className={`category-image ${currentPage === 'family' ? 'active' : ''}`}
              src={currentPage === 'family' ? family : family}
              alt="Family"
              onClick={() => handleCategoryClick('family')}
            />
          <CategoryImg
            className={`category-image ${currentPage === 'pet' ? 'active' : ''}`}
            src={currentPage === 'pet' ? pet : pet}
            alt="Pet"
            onClick={() => handleCategoryClick('pet')}
          />
          <CategoryImg
            className={`category-image ${currentPage === 'profile' ? 'active' : ''}`}
            src={currentPage === 'profile' ? profile : profile}
            alt="Profile"
            onClick={() => handleCategoryClick('profile')}
          />
          <CategoryImg
            className={`category-image ${currentPage === 'wedding' ? 'active' : ''}`}
            src={currentPage === 'wedding' ? wedding : wedding}
            alt="Wedding"
            onClick={() => handleCategoryClick('wedding')}
          />
          <CategoryImg
            className={`category-image ${currentPage === 'body' ? 'active' : ''}`}
            src={currentPage === 'body' ? body : body}
            alt="Body"
            onClick={() => handleCategoryClick('body')}
          />
        </CategoryWrap>
        <GridWrap>
          <GridDiv className="Rectangle1"> {/*수정해야함 */}
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image1" />
          </GridDiv>
          <GridDiv className="Rectangle2">
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image2" />
          </GridDiv>
          <GridDiv className="Rectangle3">
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image3" />
          </GridDiv>
          <GridDiv className="Rectangle1">
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image1" />
          </GridDiv>
          <GridDiv className="Rectangle2">
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image2" />
          </GridDiv>
          <GridDiv className="Rectangle3">
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image3" />
          </GridDiv>
          <GridDiv className="Rectangle1">
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image1" />
          </GridDiv>
          <GridDiv className="Rectangle2">
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image2" />
          </GridDiv>
          <GridDiv className="Rectangle3">
            <GridImg src="https://i.namu.wiki/i/aRAQu813Cdn2FJ5Uo3bxqMPqxGnQX7qSHbGsQiiKBbzruZKKKXOjBmVQuietbkSvq54sGhe7RFKa16HqIsLyFQ.webp" alt="Image3" />
          </GridDiv>
          {/* Add more rectangles here for the rest of the grid */}
        </GridWrap>
                
      </InsideWrap>
    </OutWrap>
  );
};

export default Homepage;
