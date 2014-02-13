package stdio.kiteDream.module.prize.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import stdio.kiteDream.module.coins.bean.Coins;
import stdio.kiteDream.module.coins.dao.CoinsDao;
import stdio.kiteDream.module.prize.bean.Order;
import stdio.kiteDream.module.prize.bean.Prize;
import stdio.kiteDream.module.prize.dao.OrderDao;
import stdio.kiteDream.module.prize.dao.PrizeDao;
import stdio.kiteDream.module.user.dao.UserDao;

@Service
public class PrizeServiceImpl implements PrizeService {
	@Autowired
	PrizeDao prizeDao;
	@Autowired
	UserDao userDao;
	@Autowired
	OrderDao orderDao;
	@Autowired
	CoinsDao coinsDao;

	@Override
	public List<Prize> getPrizes() {
		return prizeDao.getPrizes();
	}

	@Override
	public List<Prize> getPrizes(int pageNo, int pageSize) {
		return prizeDao.getPrizes(pageNo, pageSize);
	}

	@Override
	public Prize getPrize(String id) {
		return prizeDao.getPrize(id);
	}

	@Override
	public boolean savePrize(Prize prize) {
		return prizeDao.savePrize(prize);
	}

	@Override
	public boolean deletePrize(String id) {
		return prizeDao.delPrize(id);
	}

	@Override
	public int manageBuy(int userid, int prizeid, String address) {
		Prize prize = prizeDao.getPrize(prizeid+"");
		Coins coins = coinsDao.getUserCoins(userid+"");
		if(prize!=null&&prize.getNum()<0){
			return 2;
		}
		if(coins.getGreenNum()>=prize.getCoins().getGreenNum()&&coins.getRedNum()>=prize.getCoins().getRedNum()&&coins.getYellowNum()>=prize.getCoins().getYellowNum()){
			coins.setGreenNum(coins.getGreenNum()-prize.getCoins().getGreenNum());
			coins.setRedNum(coins.getRedNum()-prize.getCoins().getRedNum());
			coins.setYellowNum(coins.getYellowNum()-prize.getCoins().getYellowNum());
			prize.setNum(prize.getNum()-1);
			prizeDao.savePrize(prize);
			coinsDao.saveCoins(coins);
		}else{
			return 3;
		}
		Order order = new Order();
		order.setAddredss(address);
		order.setNum(1);
		order.setUser(userDao.getUser(userid+""));
		order.setPrize(prize);
		orderDao.saveOrder(order);
		return 1;
	}

	@Override
	public List<Order> getUserOrders(int userid, int pageNo, int pageSize) {
		return orderDao.getUserOrders(pageNo, pageSize, userid);
	}
	

}